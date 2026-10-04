const AuthLayout = ({ children }) => {
  return (
    <>
      <main className=" min-h-screen transition-colors duration-300">
        {children}
      </main>
    </>
  );
};

export default AuthLayout;
