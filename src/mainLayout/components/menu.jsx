import React from "react";
import { Link } from "react-router-dom";
import { Icon, Sidebar, Menu, Container, Image } from "semantic-ui-react";

import WhoAmI from "../../login/components/whoAmI";

export const leftItems = [
    { children: <Link to="/history">Historique</Link>, key: "history" },
    { children: <Link to="/shotgun">Shotgun</Link>, key: "shotgun" },
    { children: <Link to="/trips">Trajets</Link>, key: "trips" },
    { children: <Link to="/scores">Scores</Link>, key: "scores" },
    { children: <Link to="/checklist">Checklist</Link>, key: "checklist" },
    { children: <Link to="/contact">Contact</Link>, key: "contact" },
];
export const rightItems = [{ children: <WhoAmI />, key: "user" }];

const NavBarMobile = ({ onToggle, rightItems }) => (
    <Menu fixed="top" inverted>
        <Menu.Item onClick={onToggle}>
            <Icon name="sidebar" />
        </Menu.Item>
        <Menu.Item>
            <Link to="/">
                {" "}
                <Image src="static/logov3.png" size="small" />
            </Link>
        </Menu.Item>
        <Menu.Menu position="right">
            {rightItems.map(({ key, ...item }) => (
                <Menu.Item key={key} {...item} as="div" />
            ))}
        </Menu.Menu>
    </Menu>
);

const NavBarDesktop = ({ leftItems, rightItems }) => (
    <Menu fixed="top" inverted>
        <Menu.Item>
            <Link to="/">
                {" "}
                <Image src="static/logov3.png" size="small" />
            </Link>
        </Menu.Item>
        {leftItems.map(({ key, ...item }) => (
            <Menu.Item key={key} {...item} as="div" />
        ))}
        <Menu.Menu position="right">
            {rightItems.map(({ key, ...item }) => (
                <Menu.Item key={key} {...item} as="div" />
            ))}
        </Menu.Menu>
    </Menu>
);

class NavBarChildren extends React.Component {
    render() {
        const { children, bigContainer } = this.props;
        if (bigContainer)
            return (
                <Container fluid style={{ padding: "6.2rem 2rem 0 2rem" }}>
                    {children}
                </Container>
            );
        else
            return (
                <Container text style={{ paddingTop: "6.2rem" }}>
                    {children}
                </Container>
            );
    }
}

// semantic-ui-react 2 dropped Responsive: the mobile bar is shown below its old tablet breakpoint
const mobileQuery = window.matchMedia("(max-width: 767px)");

class NavBar extends React.Component {
    state = {
        visible: false,
        isMobile: mobileQuery.matches,
    };

    componentDidMount() {
        mobileQuery.addEventListener("change", this.handleMediaChange);
    }

    componentWillUnmount() {
        mobileQuery.removeEventListener("change", this.handleMediaChange);
    }

    handleMediaChange = (event) => this.setState({ isMobile: event.matches });

    handlePusher = () => {
        const { visible } = this.state;

        if (visible) this.setState({ visible: false });
    };

    handleToggle = () => this.setState({ visible: !this.state.visible });

    render() {
        const { children, leftItems, rightItems, bigContainer } = this.props;
        const { visible, isMobile } = this.state;
        return (
            <div>
                {isMobile ? (
                    <Sidebar.Pushable>
                        <Sidebar as={Menu} animation="overlay" inverted vertical visible={visible}>
                            {leftItems.map(({ key, ...item }) => (
                                <Menu.Item
                                    key={key}
                                    {...item}
                                    as="div"
                                    onClick={this.handlePusher}
                                />
                            ))}
                        </Sidebar>
                        <Sidebar.Pusher
                            dimmed={visible}
                            onClick={this.handlePusher}
                            style={{ minHeight: "100vh" }}
                        >
                            <NavBarMobile onToggle={this.handleToggle} rightItems={rightItems} />
                            <NavBarChildren bigContainer={bigContainer}>{children}</NavBarChildren>
                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                ) : (
                    <>
                        <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
                        <NavBarChildren bigContainer={bigContainer}>{children}</NavBarChildren>
                    </>
                )}
            </div>
        );
    }
}

export default NavBar;
