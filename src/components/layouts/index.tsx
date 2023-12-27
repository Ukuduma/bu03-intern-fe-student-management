import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { AppDispatch, RootState } from 'redux/store';
import { changeBodyAttribute } from 'utils/menu';
import { changeSidebarType } from 'redux/layout/actions';
import { SideBarTypes } from 'utils/constants';


// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import('./Topbar'));
const LeftSidebar = React.lazy(() => import('./LeftSidebar'));
const Footer = React.lazy(() => import('./Footer'));

const loading = () => <div className=""></div>;

interface VerticalLayoutProps {
  children?: any;
}

const VerticalLayout = ({ children }: VerticalLayoutProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    leftSideBarType,
  } = useSelector((state: RootState) => ({
    leftSideBarType: state.Layout.leftSideBarType,
  }));

  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

  useEffect(() => {
    changeBodyAttribute('data-leftbar-size', leftSideBarType);
  }, [leftSideBarType]);

  /**
   * Open the menu when having mobile screen
   */
  const openMenu = () => {
    setIsMenuOpened((prevState) => !prevState);

    if (document.body) {
      if (isMenuOpened) {
        document.body.classList.remove('sidebar-enable');
      } else {
        document.body.classList.add('sidebar-enable');
      }
    }
  };

  const updateDimensions = useCallback(() => {
    // activate the condensed sidebar if smaller devices like ipad or tablet
    if (window.innerWidth > 768 && window.innerWidth <= 1028) {
      dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_CONDENSED));
    } else if (window.innerWidth > 1028) {
      dispatch(changeSidebarType(SideBarTypes.LEFT_SIDEBAR_TYPE_DEFAULT));
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [dispatch, updateDimensions]);

  const isCondensed: boolean = leftSideBarType === SideBarTypes.LEFT_SIDEBAR_TYPE_CONDENSED;

  return (
    <>
      <div id="wrapper">
        <Suspense fallback={loading()}>
          <Topbar openLeftMenuCallBack={openMenu} hideLogo={false} />
        </Suspense>
        <Suspense fallback={loading()}>
          <LeftSidebar isCondensed={isCondensed} />
        </Suspense>
        <div className="content-page">
          <div className="content">
            <Container fluid>
              <Suspense fallback={loading()}>{children}</Suspense>
            </Container>
          </div>

          <Suspense fallback={loading()}>
            <Footer />
          </Suspense>
        </div>
      </div>
    </>
  );
};
export default VerticalLayout;
