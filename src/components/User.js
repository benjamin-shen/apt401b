import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import Nav from "./Nav";
import Back from "./Back";
import View from "./View";
import ProfileButton from "./ProfileButton";
import Show from "./Show";
import Notes from "./Notes";
import Log from "./Log";
import "../styles/User.css";

const User = () => {
  const { currentUser, guestUser } = useContext(AuthContext);
  if (!currentUser || guestUser) {
    return <Redirect to="/guest" />;
  }
  const info = currentUser.displayName || currentUser.email;

  return (
    <div className="user">
      <Helmet>
        {info && <title>{info}</title>}
        {info && <meta name="title" content={info} />}
      </Helmet>
      <Nav>
        <Back />
        <View text="Guest View" link="/guest" />
        <ProfileButton link="/user/profile" />
      </Nav>
      <Container>
        <h1>
          User
          {info && ": " + info}
        </h1>
        <Notes type="apartment" document="private" />
        <Show text="View Doorbell Log">
          <Log type="doorbell" />
        </Show>
        <Show text="View Login Log">
          <Log type="login" />
        </Show>
      </Container>
    </div>
  );
};

export default User;
