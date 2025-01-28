import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import crypto from "crypto";
import authMiddleware from "../middleware/auth.js";
import Student from "../models/Student.js";
import dotenv from "dotenv";
import Teacher from "../models/Teacher.js";
import sendVerificationEmail from "../nodemailer.js";
import Subject from "../models/Subject.js";
import Class from "../models/Class.js";
import { registerParent } from "../controllers/auth.controller.js";
import { registerStudent } from "../controllers/admin.controller.js";
import Parent from "../models/Parent.js";
import User from "../models/User.js";
import Invoice from "../models/Invoice.js";


const router = express.Router();
dotenv.config();
router.use(cors());

// Super admin user
const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('adminpassword', salt);

        // Create new admin
        const admin = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            phone: '1234567890',
            role: "admin",
            password: hashedPassword,
        });

        await admin.save();
        console.log('Admin user created successfully!');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

seedAdmin();


//register a parent
router.post('/register-parent', authMiddleware, registerParent);

//register new student
router.post('/register-student', authMiddleware, registerStudent);

//register new teacher and sending verification link
router.post('/register-teacher', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { firstName, lastName, email, phone, position, gender, role, password } = req.body;
        if (!firstName || !lastName || !email || !phone || !position || !gender || !role || !password) {
            return res.status(400).json({ message: "all fields are required" })
        }
        //hashing password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        //generating token
        const token = crypto.randomBytes(32).toString('hex');
        //checking if the user exists
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "User with same email already exists" })
        }
        //creating the new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            gender,
            role
        });
        //saving to the db
        await newUser.save();
        //creating new teacher document
        const newTeacher = new Teacher({
            commonDetails: newUser._id,
            position,
            verificationToken: token,
        });
        //save user to db
        await newTeacher.save();
        //send verification email
        sendVerificationEmail(newUser, token)
        return res.status(201).json({ message: "User registered successfully,please verify via email" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//adding subjects 
router.post('/add-subject', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { name, code } = req.body;
        if (!name || !code) {
            return res.status(400).json({ message: "all fields are required" })
        }
        const newSubject = new Subject({
            name,
            code
        });
        //save subject to db
        await newSubject.save();
        return res.status(201).json({ message: "subject registered successfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//adding classes
router.post("/add-class", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        const { className, subjects } = req.body;
        if (!className || !subjects) {
            return res.status(400).json({ message: "all fields are required" })
        }
        const subjectIds = await Subject.find({ _id: { $in: subjects } })
        if (!subjectIds) {
            return res.status(404).json({ message: 'no subject with that id found' })
        }
        const newClass = new Class({
            className,
            subjects: subjectIds,
            students: [] // Initially, no students are assigned
        });
        await newClass.save();
        res.status(201).json({ message: "class added successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Invoice generation for a student
router.post('/generate-invoice', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied!' });
        }

        const { studentId, term, totalFees, year } = req.body;
        console.log(req.body)

        if (!studentId || !term || !totalFees || !year) {
            return res.status(400).json({ message: 'Student ID, term, year, and total fees are required!' });
        }

        // Ensure totalFees is a valid number
        const fees = Number(totalFees);
        if (isNaN(fees) || fees <= 0) {
            return res.status(400).json({ message: 'Total fees must be a valid positive number!' });
        }

        // Check if an invoice already exists for the student and the given term/year
        const existingInvoice = await Invoice.findOne({ studentId, term, year });
        if (existingInvoice) {
            return res.status(400).json({ message: `Invoice already exists for student ${studentId} for term ${term} of year ${year}.` });
        }

        // Find the most recent invoice to carry forward any outstanding balance
        const previousInvoice = await Invoice.findOne({ studentId }).sort({ year: -1, term: -1 });

        let carriedForwardBalance = 0;
        if (previousInvoice) {
            carriedForwardBalance = Number(previousInvoice.outstandingBalance || 0);
        }

        // Calculate the new outstanding balance
        const outstandingBalance = fees + carriedForwardBalance;

        // Create a new invoice entry
        const newInvoice = new Invoice({
            studentId,
            term,
            year,
            totalFees: fees,
            carriedForwardBalance,
            outstandingBalance,
        });

        // Save invoice to the database
        await newInvoice.save();

        res.status(201).json({ message: 'Invoice generated successfully', invoice: newInvoice });
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ message: 'Server error, please try again.' });
    }
});




// Generate invoices for a whole class
router.post('/generate-class-invoice', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied!' });
        }

        const { classId, term, totalFees, year } = req.body;

        if (!classId || !term || !totalFees) {
            return res.status(400).json({ message: 'Class, term, and total fees are required!' });
        }

        // Find all students in the specified class
        const students = await Student.find({ currentClass: classId });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found in the selected class!' });
        }

        const invoices = [];

        for (const student of students) {
            // Check if an invoice already exists for the student and term
            const existingInvoice = await Invoice.findOne({ studentId: student._id, term, year });
            if (existingInvoice) {
                console.log(`Invoice already exists for student ${student._id} for term ${term}. Skipping.`);
                continue; // Skip generating invoice if it already exists
            }

            // Check for carried forward balance
            const previousInvoice = await Invoice.findOne({ studentId: student._id }).sort({ year: -1, term: -1 }); // sort per term and year
            const carriedForwardBalance = previousInvoice ? previousInvoice.outstandingBalance : 0;

            // Ensure numeric operations
            const totalFeesNumber = Number(totalFees);
            const carriedForwardNumber = Number(carriedForwardBalance);
            const outstandingBalance = totalFeesNumber + carriedForwardNumber;

            // Create a new invoice for the student
            const newInvoice = new Invoice({
                studentId: student._id,
                term,
                year,
                totalFees: totalFeesNumber,
                carriedForwardBalance: carriedForwardNumber,
                outstandingBalance: outstandingBalance,
            });

            invoices.push(newInvoice);
        }

        if (invoices.length === 0) {
            return res.status(200).json({ message: 'No new invoices to generate. All students already have invoices for the specified term.' });
        }

        // Save all invoices in bulk
        await Invoice.insertMany(invoices);

        res.status(201).json({ message: 'Invoices generated successfully for students without existing invoices for this term!' });
    } catch (error) {
        console.error('Error generating class invoices:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});





//delete subject
router.delete("/delete-subject/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        const subject = req.params.id;
        //finding relevant id for deletion
        const result = await Subject.findByIdAndDelete(subject);
        if (result) {
            return res.status(200).json({ message: 'Subject deleted successfully.' });
        } else {
            return res.status(404).json({ message: 'Entry not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting entry', error });
        console.error(error)
    }
});

//delete teacher
router.delete("/delete-teacher/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        const teacherId = req.params.id;
        //finding relevant id for deletion
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Parent not found!' });
        }
        const userId = teacher.commonDetails;
        //deleting the user
        await User.findByIdAndDelete(userId);
        await Teacher.findByIdAndDelete(teacherId);
        return res.status(200).json({ message: 'Teacher deleted successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to delete the Teacher user' });
        console.error(error)
    }
});

//delete class
router.delete("/delete-class/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        const subject = req.params.id;
        //finding relevant id for deletion
        const result = await Class.findByIdAndDelete(subject);
        if (result) {
            return res.status(200).json({ message: 'class deleted successfully.' });
        } else {
            return res.status(404).json({ message: 'Entry not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting entry', error });
        console.error(error)
    }
});

//delete student
router.delete("/delete-student/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        const studentId = req.params.id;
        //finding relevant id for deletion
        const result = await Student.findByIdAndDelete(studentId);
        if (result) {
            return res.status(200).json({ message: 'student deleted successfully.' });
        } else {
            return res.status(404).json({ message: 'Entry not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting entry', error });
        console.error(error)
    }
});

//delete parent user
router.delete("/delete-parent/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        const parentId = req.params.id;
        // Find the parent record
        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found!' });
        }

        //delete related user
        const userId = parent.commonDetails;
        await User.findByIdAndDelete(userId);
        //finding relevant parent id for deletion
        await Parent.findByIdAndDelete(parentId);
        return res.status(200).json({ message: 'Parent and associated user deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete the parent user' });
        console.error(error)
    }
});

//get total students and trend direction
router.get('/student-stats', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        //counting totals
        const totalStudents = await Student.countDocuments();
        // Get the count of students from the previous month (for trend calculation)
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const previousMonthStudents = await Student.countDocuments({
            created_at: { $lt: oneMonthAgo }
        });
        // Calculate the trend direction
        let trendDirection = 'neutral';
        if (totalStudents > previousMonthStudents) {
            trendDirection = 'up';
        } else if (totalStudents < previousMonthStudents) {
            trendDirection = 'down'
        }
        //calculate percentage change
        const trendPercentage = previousMonthStudents > 0 ? ((totalStudents - previousMonthStudents) / previousMonthStudents) * 100 : 0; //avoids division by zero
        // Return the stats
        return res.status(201).json({ totalStudents, trendDirection, trendPercentage: trendPercentage.toFixed(2) });// Format to 2 decimal places
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return res.status(500).json({ message: 'Error fetching student statistics' });
    }
});


//get total teachers and trend direction
router.get('/teacher-stats', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        //total teachers
        const totalTeachers = await Teacher.countDocuments();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        //getting teachers from one month ago
        const previousMonthTeachers = await Teacher.countDocuments({
            created_at: { $lt: oneMonthAgo }
        });
        //setting trend direction
        let trendDirection = 'neutral';
        if (totalTeachers > previousMonthTeachers) {
            trendDirection = 'up'
        } else if (totalTeachers < previousMonthTeachers) {
            trendDirection = 'down'
        }
        //total percentage calculation
        const trendPercentage = previousMonthTeachers > 0 ? ((totalTeachers - previousMonthTeachers) / previousMonthTeachers) * 100 : 0;
        return res.status(201).json({ totalTeachers, trendDirection, trendPercentage: trendPercentage.toFixed(2) })
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return res.status(500).json({ message: 'Error fetching student statistics' });
    }
})

//get total users and trend direction
router.get('/total-users', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        //total teachers
        const totalTeachers = await Teacher.countDocuments();
        const totalStudents = await Student.countDocuments();
        const totalUsers = totalStudents + totalTeachers;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        //getting teachers from one month ago
        const previousMonthTeachers = await Teacher.countDocuments({
            created_at: { $lt: oneMonthAgo }
        });
        //getting students one month ago
        const previousMonthStudents = await Student.countDocuments({
            created_at: { $lt: oneMonthAgo }
        })
        //one month total users
        const previousMonthUsers = previousMonthStudents + previousMonthTeachers;
        //trend direction
        let trendDirection = 'neutral';
        if (totalUsers > previousMonthStudents) {
            trendDirection = 'up'
        } else if (totalUsers < previousMonthUsers) {
            trendDirection = 'down'
        }
        //percentage calculation
        const trendPercentage = previousMonthUsers > 0 ? ((totalUsers - previousMonthUsers) / previousMonthUsers) * 100 : 0
        return res.status(201).json({ totalUsers, trendDirection, trendPercentage: trendPercentage.toFixed(2) });
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return res.status(500).json({ message: 'Error fetching student statistics' });
    }
});

//checking distribution in a class
router.get('/class-distribution', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        //aggregate students by class with counts per gender and age
        const classDistribution = await Class.aggregate([
            {
                //allows combining of data(collections join to single query)
                $lookup: {
                    from: 'students',
                    localField: '_id',
                    foreignField: 'currentClass',
                    as: 'students', //students array
                },
            },
            {
                $project: {
                    className: 1,
                    total: { $size: '$students' },// Total number of students
                    maleCount: {
                        $size: {
                            $filter: {
                                input: { $ifNull: ['$students', []] }, // Ensure input is an array
                                as: 'student',
                                cond: { $eq: ['$$student.gender', 'male'] },// Filter males
                            },
                        },
                    },
                    femaleCount: {
                        $size: {
                            $filter: {
                                input: { $ifNull: ['$students', []] }, // Ensure input is an array
                                as: 'student',
                                cond: { $eq: ['$$student.gender', 'female'] },// Filter females
                            },
                        },
                    },
                    ages: {
                        $map: {
                            input: { $ifNull: ['$students', []] }, // Ensure input is an array
                            as: 'student',
                            in: '$$student.age',// Extract ages
                        },
                    },
                }
            }])
        res.status(200).json(classDistribution);
    } catch (error) {
        console.error('Error fetching student stats:', error);
        res.status(500).json({ message: 'Error fetching student statistics' });
    }
})

//fetch subjects
router.get("/get-subjects", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "teacher") {
            return res.status(403).json({ message: 'Access denied' })
        }
        const subjects = await Subject.find();
        if (!subjects) {
            return res.status(404).json({ message: "no subjects found!" })
        }
        res.status(201).json(subjects);
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return res.status(500).json({ message: 'Error fetching student statistics' });
    }
})
//fetch students
router.get("/get-students", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        //fetch students from all classes to class
        const students = await Class.find().populate('students').populate('subjects');
        if (!students) {
            return res.status(404).json({ message: "no students found found!" })
        }
        return res.status(201).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve classes' });
    }
});
//fetch parents
router.get("/get-parents", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: 'Access denied' })
        }
        //fetch students from all classes to class
        const parents = await Parent.find().populate({ path: 'commonDetails', select: 'firstName lastName email phone profilePic role', });
        if (!parents || parents.length === 0) {
            return res.status(404).json({ message: "no parents found!" })
        }
        return res.status(201).json(parents);
    } catch (error) {
        console.error('Error fetching parents:', error);
        res.status(500).json({ error: 'Failed to generate parents' });
    }
})

//fetch teachers
router.get("/get-teachers", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied' })
        }
        //fetch students from all classes to class
        const teachers = await Teacher.find().populate({ path: "commonDetails", select: "firstName lastName email phone profilePic role gender" });
        if (!teachers) {
            return res.status(404).json({ message: "no teachers found found!" })
        }
        return res.status(201).json(teachers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve teachers' });
    }
})
//fetch classes
router.get("/get-classes", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "teacher") {
            return res.status(403).json({ message: 'Access denied' })
        }
        const classes = await Class.find();
        if (!classes) {
            return res.status(404).json({ message: "no classes found!" })
        }
        res.status(201).json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve classes' });
    }

})

export default router;