import React from "react";
import {Link} from "react-router-dom";
import {Icon, Responsive, Sidebar, Menu, Container} from 'semantic-ui-react';


export const leftItems = [
    {children: <Link to='/'>Home</Link>, key: "home"},
    {children: <Link to='/shotgun'>Shotgun</Link>, key: "shotgun"}
];
export const rightItems = [
    {children: <Link to='/login'>User</Link>, key: "user"},
    {children: <Link to='/contact'>Contact</Link>, key: "contact"}
];

const NavBarMobile = ({
                          children,
                          leftItems,
                          onPusherClick,
                          onToggle,
                          rightItems,
                          visible
                      }) => (
    <Sidebar.Pushable>
        <Sidebar
            as={Menu}
            animation="overlay"
            //icon="labeled"
            inverted
            items={leftItems}
            vertical
            visible={visible}
        />
        <Sidebar.Pusher
            dimmed={visible}
            onClick={onPusherClick}
            style={{minHeight: "100vh"}}
        >
            <Menu fixed="top" inverted>

                <Menu.Item onClick={onToggle}>
                    <Icon name="sidebar"/>
                </Menu.Item>
                <Menu.Item>
                    Houlgate Fest
                </Menu.Item>
                <Menu.Menu position="right">
                    {rightItems.map(item => {
                        item['as'] = 'div';
                        return <Menu.Item {...item} />
                    })}
                </Menu.Menu>
            </Menu>
            {children}
        </Sidebar.Pusher>
    </Sidebar.Pushable>
);

const NavBarDesktop = ({leftItems, rightItems}) => (
    <Menu fixed="top" inverted>
        <Menu.Item>
            Houlgate Fest
        </Menu.Item>
        {leftItems.map(item => {
            item['as'] = 'div';
            return <Menu.Item {...item} />
        })}
        <Menu.Menu position="right">
            {rightItems.map(item => {
                item['as'] = 'div';
                return <Menu.Item {...item} />
            })}
        </Menu.Menu>
    </Menu>
);

const NavBarChildren = ({children}) => (
    <Container style={{marginTop: "5em"}}>{children}</Container>
);

class NavBar extends React.Component {
    state = {
        visible: false
    };

    handlePusher = () => {
        const {visible} = this.state;

        if (visible) this.setState({visible: false});
    };

    handleToggle = () => this.setState({visible: !this.state.visible});

    render() {
        const {children, leftItems, rightItems} = this.props;
        const {visible} = this.state;

        return (
            <div>
                <Responsive {...Responsive.onlyMobile}>
                    <NavBarMobile
                        leftItems={leftItems}
                        onPusherClick={this.handlePusher}
                        onToggle={this.handleToggle}
                        rightItems={rightItems}
                        visible={visible}
                    >
                        <NavBarChildren>{children}</NavBarChildren>
                    </NavBarMobile>
                </Responsive>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <NavBarDesktop leftItems={leftItems} rightItems={rightItems}/>
                    <NavBarChildren>{children}</NavBarChildren>
                </Responsive>
            </div>
        );
    }
}

export default NavBar;

