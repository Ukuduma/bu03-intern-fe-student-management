import React, { useEffect, useRef } from 'react';
import SimpleBar from 'simplebar-react';


// components
import AppMenu from './Menu';

import profileImg from 'assets/images/users/user-1.jpg';
import { getMenuItems } from 'utils/menu';

/* user box */
const UserBox = () => {
 

  return (
    <div className="user-box text-center">
      <img src={profileImg} alt="" title="Mat Helme" className="rounded-circle avatar-md" />
      <h4 className="text-muted my-2">Admin Head</h4>
    </div>
  );
};

/* sidebar content */
const SideBarContent = () => {
  return (
    <>
      <UserBox />

      <div id="sidebar-menu">
        <AppMenu menuItems={getMenuItems()} />
      </div>
      
    </>
  );
};

interface LeftSidebarProps {
  isCondensed: boolean;
}

const LeftSidebar = ({ isCondensed }: LeftSidebarProps) => {
  const menuNodeRef: any = useRef(null);

  /**
   * Handle the click anywhere in doc
   */
  const handleOtherClick = (e: any) => {
    if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
    // else hide the menubar
    if (document.body) {
      document.body.classList.remove('sidebar-enable');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOtherClick, false);

    return () => {
      document.removeEventListener('mousedown', handleOtherClick, false);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="left-side-menu" ref={menuNodeRef}>
        {!isCondensed && (
          <SimpleBar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
            <SideBarContent />
          </SimpleBar>
        )}
        {isCondensed && <SideBarContent />}
      </div>
    </React.Fragment>
  );
};

LeftSidebar.defaultProps = {
  isCondensed: false,
};

export default LeftSidebar;
