import React, { Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MdOutlineClose } from 'react-icons/md';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { URL } from '../App';
import schoologo from "../images/schoologo.png";

const navigation = [
    { name: 'Home', href: '/parent/dashboard' },
    { name: 'Invoices', href: '/parent/invoices' },
    { name: 'Assignments', href: '/parent/assignments' },
];

function ParentNavbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    async function handleLogout() {
        try {
            const response = await axios.post(`${URL}/api/users/logout`,{}, {
                method: "POST",
                headers: { 'x-access-token':token,
                    'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    }

    return (
        <div className="fixed top-0 w-full z-50">
            <Disclosure as="nav" style={{ backgroundColor: '#54B435' }}>
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-700 hover:text-white">
                                        {open ? <MdOutlineClose className="block h-6 w-6" /> : <GiHamburgerMenu className="block h-6 w-6" />}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                                    <div className="flex items-center ml-12">
                                        <img className='h-8 w-8 rounded-full' src={schoologo} alt='school logo' />
                                    </div>
                                    <div className='hidden sm:ml-6 sm:block'>
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => (
                                                <NavLink
                                                    key={item.name}
                                                    to={item.href}
                                                    className={({ isActive }) =>
                                                        isActive
                                                            ? 'bg-gray-900 text-white rounded-md px-3 py-1.5 text-sm font-medium'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-1.5 text-sm font-medium'}
                                                >
                                                    {item.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white">
                                        <IoMdNotificationsOutline className="h-6 w-6" />
                                    </button>
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button className="relative flex rounded-full bg-2E5A1C text-sm">
                                                <img className="h-8 w-8 rounded-full" src="" alt="profile thumb" />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <NavLink to="/profile" className={active ? 'bg-gray-100' : ''}>Your Profile</NavLink>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <NavLink to="/settings" className={active ? 'bg-gray-100' : ''}>Settings</NavLink>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button onClick={handleLogout} className={active ? 'bg-gray-100' : ''}>Sign out</button>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>
            <ToastContainer />
        </div>
    );
}

export default ParentNavbar;
