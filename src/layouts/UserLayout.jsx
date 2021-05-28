import HeaderUser from '../components/HeaderUser';

export const UserLayout =
    (Component) =>
    ({ ...rest }) => {
        return (
            <>
                <div className="container">
                    <HeaderUser />
                    <Component {...rest} />
                </div>
            </>
        );
    };
