import styled from "styled-components"

const Button = styled.button`
    border-radius: 4px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; 
`;
export const Product = () => {
    return (
        <div>
            <Button>Parse Product</Button>
        </div>
    )
}