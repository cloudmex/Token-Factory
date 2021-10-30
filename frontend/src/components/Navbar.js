import { useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import React, { useEffect } from "react";
import { Fragment } from 'react';
import { NavDropdown } from 'react-bootstrap';
import ProfilePicture from "../assets/img/profile.png";
import NearLogo from "../assets/img/near_logo.png";

// Mat Icons
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { logout } from '../utils'

export default function Navbar(props) {
    const location = useLocation();

    useEffect(() => {
        (async () => {

        })();
    }, []);

    return (
        <header className="w-full bg-white p-2 flex justify-between items-center border-b-2 ">
            <nav className="flex items-center justify-center">
                <img className="w-35 h-10" src={NearLogo} alt="logo"/>
                <div className="text-TextGray text-xs hidden sm:block ml-2">
                    <a href="Tokens" className={(location.pathname === '/Tokens' || (location.pathname !== '/MyTokens' && location.pathname !== '/NewToken')) ? "animate-pulse bg-gray-500 text-white p-2 rounded cursor-pointer ml-1 hover:no-underline" : "bg-NewGray hover:bg-gray-500 hover:text-white p-2 rounded cursor-pointer ml-1 hover:no-underline"}>All Tokens</a>
                </div>
                <div className="text-TextGray text-xs hidden sm:block ml-2">
                    <a href="MyTokens" className={(location.pathname === '/MyTokens') ? "animate-pulse bg-gray-500 text-white p-2 rounded cursor-pointer ml-1 hover:no-underline" : "bg-NewGray hover:bg-gray-500 hover:text-white p-2 rounded cursor-pointer ml-1 hover:no-underline"}>My Tokens</a>
                </div>
                <div className="text-TextGray text-xs hidden sm:block ml-2">
                    <a href="NewToken" className={(location.pathname === '/NewToken') ? "animate-pulse bg-gray-500 text-white p-2 rounded cursor-pointer ml-1 hover:no-underline" : "bg-NewGray hover:bg-gray-500 hover:text-white p-2 rounded cursor-pointer ml-1 hover:no-underline"}>New Token</a>
                </div>
            </nav>
            <div className="cursor-pointer flex justify-center items-center">

                <Menu as="div" className="ml-3 relative">
                    <div>
                        <Menu.Button className="bg-NewGray flex text-sm rounded-full focus:ring-offset-2 focus:ring-offset-gray-800 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 p-1">
                            {/* Photo Profile */}
                            <img className="h-8 w-8 rounded-full" src={ProfilePicture} alt="" />
                            <label className="text-TextGray text-base my-auto ml-2 cursor-pointer">{window.accountId}</label>
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
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <NavDropdown.Item onClick={logout}>
                                <ExitToAppIcon />Sign Out
                            </NavDropdown.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
}
