import { useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Lottie from "react-lottie";
import { Link } from "react-router-dom";
import childWalkLottie from "assets/images/lotties/child-walk.json";

import Logo from "assets/images/users/user-1.jpg";

interface AccountLayoutProps {
  helpText?: string;
  bottomLinks?: any;
  isCombineForm?: boolean;
  children?: any;
}

const AuthLayout = ({
  helpText,
  bottomLinks,
  children,
  isCombineForm,
}: AccountLayoutProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (document.body)
      document.body.classList.add(
        "authentication-bg",
        "authentication-bg-pattern"
      );

    return () => {
      if (document.body)
        document.body.classList.remove(
          "authentication-bg",
          "authentication-bg-pattern"
        );
    };
  }, []);

  return (
    <>
      <div className="account-pages d-flex align-items-center">
        <Container className="p-4 d-flex align-items-center">
          {/* <Row className="justify-content-center"> */}
          {/* <Col md={8} lg={6} xl={isCombineForm ? 9 : 4}> */}
          <div className="lottie-image">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: childWalkLottie,
              }}
              // height={500}
            />
          </div>
          <Card className="bg-pattern shadow-lg" style={{ flex: 1 }} >
            <Card.Body>

              <div className="login">
                <div className="text-center w-75 m-auto">
                  <div className="auth-logo">
                    <Link to="/" className="logo text-center">
                      <span className="logo-lg">
                        <img src={Logo} alt="" height="10%" className="rounded-circle" />
                      </span>
                    </Link>
                  </div>
                  <h1 className="mt-2 mb-4 font-weight-bold text-dark">{t("WELCOME")}</h1>
                </div>
                {children}
              </div>
            </Card.Body>
          </Card>

          {/* bottom links */}
          {bottomLinks}
        </Container>
      </div>

      {/* <footer className="footer footer-alt">
        {new Date().getFullYear()} &copy;&nbsp;
        <Link to="#" className="text-white-50">
          Base_title
        </Link>
      </footer> */}
    </>
  );
};

export default AuthLayout;
