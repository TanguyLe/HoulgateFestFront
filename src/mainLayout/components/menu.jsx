import React from "react";
import { Link } from "react-router-dom";
import { Icon, Responsive, Sidebar, Menu, Container, Image } from "semantic-ui-react";

import WhoAmI from "../../login/components/whoAmI";

export const leftItems = [
    { children: <Link to='/history'>Historique</Link>, key: "history"},
    {children: <Link to="/shotgun">Shotgun</Link>, key: "shotgun" },
    { children: <Link to="/trips">Trajets</Link>, key: "trips" },
    { children: <Link to="/scores">Scores</Link>, key: "scores" },
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
            {rightItems.map((item) => {
                item["as"] = "div";
                return <Menu.Item {...item} />;
            })}
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
        {leftItems.map((item) => {
            item["as"] = "div";
            return <Menu.Item {...item} />;
        })}
        <Menu.Menu position="right">
            {rightItems.map((item) => {
                item["as"] = "div";
                return <Menu.Item {...item} />;
            })}
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

class NavBar extends React.Component {
    state = {
        visible: false,
    };

    handlePusher = () => {
        const { visible } = this.state;

        if (visible) this.setState({ visible: false });
    };

    handleToggle = () => this.setState({ visible: !this.state.visible });

    render() {
        const { children, leftItems, rightItems, bigContainer } = this.props;
        const { visible } = this.state;
        return (
            <div>
                <Responsive {...Responsive.onlyMobile}>
                    <Sidebar.Pushable>
                        <Sidebar as={Menu} animation="overlay" inverted vertical visible={visible}>
                            {leftItems.map((item) => {
                                item["as"] = "div";
                                return <Menu.Item {...item} onClick={this.handlePusher} />;
                            })}
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
                </Responsive>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
                    <NavBarChildren bigContainer={bigContainer}>{children}</NavBarChildren>
                </Responsive>
            </div>
        );
    }
}

export default NavBar;
