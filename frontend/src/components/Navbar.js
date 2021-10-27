import { useLocation } from "react-router-dom";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import NavbarInput from "@material-tailwind/react/NavbarInput";
import Image from "@material-tailwind/react/Image";
import Dropdown from "@material-tailwind/react/Dropdown";
import DropdownItem from "@material-tailwind/react/DropdownItem";
import Card from "@material-tailwind/react/Card";
import Input from "@material-tailwind/react/Input";
import Switch from '@material-ui/core/Switch';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import React, { useState, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import { Fragment } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import TabContent from "@material-tailwind/react/TabContent";
import TabPane from "@material-tailwind/react/TabPane";
import CardHeader from "@material-tailwind/react/CardHeader";
import ProfilePicture from "../assets/img/profile.png";
import NearLogo from "../assets/img/near_logo.png";

// Mat Icons
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { login, logout } from '../utils'

import getConfig from '../config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function Navbar({ showSidebar, setShowSidebar }) {

    const styles = {
        select: {
            width: '100%',
            maxWidth: 600
        }
    }

    useEffect(() => {
        (async () => {
            try {
                
                HeaderView();
            } catch (error) {

            }

            try {

            } catch (error) {

            }

        })();
    }, []);

    function HeaderView() {
        const location = useLocation();
        console.log(location.pathname);
        return <span>Path : {location.pathname}</span>
      }

    return (
        <header class="w-full bg-white p-2 flex justify-between items-center border-b-2 ">
            <nav class="flex items-center justify-center">
                <img class="w-35 h-10" src={NearLogo} />
                <div class="text-TextGray text-xs hidden sm:block ml-2">
                    <a href="Tokens" class="bg-NewGray hover:bg-gray-500 p-2 rounded cursor-pointer ml-1 hover:no-underline">All Tokens</a>
                </div>
                <div class="text-TextGray text-xs hidden sm:block ml-2">
                    <a href="MyTokens" class="bg-NewGray hover:bg-gray-500 p-2 rounded cursor-pointer ml-1 hover:no-underline">My Tokens</a>
                </div>
                <div class="text-TextGray text-xs hidden sm:block ml-2">
                    <a href="NewToken" class="bg-NewGray hover:bg-gray-500 p-2 rounded cursor-pointer ml-1 hover:no-underline">New Token</a>
                </div>
            </nav>
            <div class="cursor-pointer flex justify-center items-center">

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
