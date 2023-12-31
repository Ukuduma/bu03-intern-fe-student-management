import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// layout constants

// store
import { RootState } from "redux/store";

import LeftSideBarLayout from "components/layouts";
import DefaultLayout from "components/layouts/Default";
import CoursesPage from "../pages/CoursesPage";
import {
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes
} from "./index";
import CourseModifyPage from "../pages/CourseModifyPage";
import AddCourseForm from "../pages/AddCourseForm";

const Routes = (props: any) => {
  const { layout } = useSelector((state: RootState) => ({
    layout: state.Layout,
  }));

  const Layout = LeftSideBarLayout;
  return (
      <BrowserRouter>
        <Switch>
          <Route path="/courses/modify/:id">
            <Layout {...props}>
              <CourseModifyPage />
            </Layout>
          </Route>

          <Route path="/courses/add">
            <Layout {...props}>
              <AddCourseForm />
            </Layout>
          </Route>

          <Route path="/courses">
            <Layout {...props}>
              <CoursesPage />
            </Layout>
          </Route>

          <Route path={publicProtectedFlattenRoutes.map((r: any) => r["path"])}>
            <DefaultLayout {...props} layout={layout} >
              <Switch>
                {publicProtectedFlattenRoutes.map((route: any, index: number) => {
                  return (
                      !route.children && (
                          <route.route
                              key={index}
                              path={route.path}
                              roles={route.roles}
                              exact={route.exact}
                              component={route.component}
                          />
                      )
                  );
                })}
              </Switch>
            </DefaultLayout>
          </Route>

          <Route path={authProtectedFlattenRoutes.map((r: any) => r["path"])}>
            <Layout {...props}>
              <Switch>
                {authProtectedFlattenRoutes.map((route: any, index: number) => {
                  return (
                      !route.children && (
                          <route.route
                              key={index}
                              path={route.path}
                              roles={route.roles}
                              exact={route.exact}
                              component={route.component}
                          />
                      )
                  );
                })}
              </Switch>
            </Layout>
          </Route>
        </Switch>
      </BrowserRouter>
  );
};

export default Routes;
