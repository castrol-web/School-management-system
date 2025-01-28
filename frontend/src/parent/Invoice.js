import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useInvoiceStore from '../zustand/useInvoiceStore';
import useSingleParentStore from '../zustand/useSingleParentStore';
import { FaInfoCircle } from 'react-icons/fa'; // Importing an icon from React Icons

function Invoice() {
    const { fetchStatements, invoices } = useInvoiceStore();
    const { fetchParent, studentId } = useSingleParentStore();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [selectedInvoice, setSelectedInvoice] = useState(null); // State to track selected invoice

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            const id = decoded._id;
            fetchParent(token, id);
        }
    }, [token, fetchParent]);

    useEffect(() => {
        if (token && studentId) {
            fetchStatements(studentId, token);
        }
    }, [token, studentId, fetchStatements]);

    return (
        <div className="mt-10 mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Invoice Summary</h1>
            {invoices.length === 0 ? (
                <p className="text-center text-gray-500">No invoices available</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th>Term</th>
                                <th>Total Fees</th>
                                <th>Paid</th>
                                <th>Outstanding</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-gray-50">
                                    <td>{invoice.term}</td>
                                    <td>{invoice.totalFees}</td>
                                    <td>
                                        {invoice.payments.reduce(
                                            (total, payment) => total + payment.amount,
                                            0
                                        )}
                                    </td>
                                    <td>{Number(invoice.outstandingBalance)}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm flex items-center gap-2"
                                            onClick={() => setSelectedInvoice(invoice)}
                                        >
                                            <FaInfoCircle />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Invoice Details */}
            {selectedInvoice && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => setSelectedInvoice(null)}
                >
                    <div
                        className="modal-box relative w-96 bg-white p-6 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={() => setSelectedInvoice(null)}
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
                        <p>
                            <strong>Term:</strong> {selectedInvoice.term}
                        </p>
                        <p>
                            <strong>Total Fees:</strong> {selectedInvoice.totalFees}
                        </p>
                        <p>
                            <strong>Paid:</strong>{' '}
                            {selectedInvoice.payments.reduce(
                                (total, payment) => total + payment.amount,
                                0
                            )}
                        </p>
                        <p>
                            <strong>Outstanding:</strong> {selectedInvoice.outstandingBalance}
                        </p>
                        <h3 className="mt-4 text-lg font-semibold">Payments:</h3>
                        {selectedInvoice.payments.length === 0 ? (
                            <p>No payments made yet</p>
                        ) : (
                            <ul className="list-disc ml-5">
                                {selectedInvoice.payments.map((payment, index) => (
                                    <li key={index}>
                                        {payment.amount} on {new Date(payment.date).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Invoice;
