import { useNavigate } from 'react-router-dom';
import { NavLinkProps } from '@mantine/core';
import { NavLink } from '@mantine/core';

interface CustomNavLinkProps extends NavLinkProps {
  to: string;  // 'to' prop can be used for route navigation
}

const CustomNavLink: React.FC<CustomNavLinkProps> = ({ to, children, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();  // Prevent the default behavior to avoid full re-render
    navigate(to);  // Use navigate from React Router to change the route without reloading the page
  };

  return (
    <NavLink {...props} onClick={handleClick}>
      {children}
    </NavLink>
  );
};

export default CustomNavLink;
