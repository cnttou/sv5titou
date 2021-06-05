import HeaderUser from '../components/HeaderUser';

const UserLayout =
    (Component) =>
    ({ ...rest }) => {
        return (
            <div className="container-xl">
                <HeaderUser />
                <Component {...rest} />
            </div>
        );
    };
export default UserLayout;
