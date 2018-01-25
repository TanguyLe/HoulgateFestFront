import React from "react";
import {Link} from "react-router-dom";
import {Menu, Item, Container} from 'semantic-ui-react';

export const Header = () => (
    <Menu className={'secondary large fixed shadowMenu'}>
        <Container>
            <Item>Houlgate Fest</Item>
            <Menu className={'secondary right'}>
                <Item><Link to="/">Home</Link></Item>
                <Item><Link to="/shotgun">Shotgun</Link></Item>
                <Item><Link to="/login">User</Link></Item>
            </Menu>
        </Container>
    </Menu>
);

export default Header;
