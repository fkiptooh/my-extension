import styled from "styled-components";

const Nav = styled.nav`
    display: flex;
    height: 1.5em;
    justify-content: space-between;
    padding: 4px;
`;

const Separator = styled.hr`
    border: 0;
    height: 1px;
    background: #ddd;
    margin: 0;
`;

const Links = styled.a`
    color: black;
    text-decoration: none;
    font-size: 14px;
`;

export const Navbar = () => {
    return (
        <>
        <Nav>
            <Links href="#">Logie</Links>
            <Links href="/back">Exit</Links>
        </Nav>
        <Separator/>
        </>
    )
}