import React from 'react';
import { FaEnvelope, FaLock, FaUserSlash, FaEyeSlash, FaTrashAlt } from 'react-icons/fa'; // Icons
import ChangePasswordDialog from './ChangePasswordDialog';
import ChangeEmailDialog from './ChangeEmailDialog';
import BlockUserDialog from './BlockUserDialog';
import ProfileVisibilityDialog from './ProfileVisibilityDialog';
import DeleteAccountDialog from './DeleteAccountDialog';

const settings = () => {
  return (
    <div className="flex justify-center w-[30vw] min-w-[330px] m-auto overflow-auto items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-blue-900 mb-6 text-center">Settings</h1>
        <div className="space-y-4">
          <div>
            <ChangeEmailDialog/>
          </div>

          <div className='w-full'>
            <ChangePasswordDialog className="w-full" />
          </div>

          {/* <div className='w-full'>
            <BlockUserDialog/>
          </div> */}

          {/* <div className='w-full'>
            <ProfileVisibilityDialog/>
          </div> */}


          <div>
            <DeleteAccountDialog/>
          </div>

        </div>
      </div>
    </div>
  );
};

export default settings;
