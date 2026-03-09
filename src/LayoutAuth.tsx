import './assets/LayoutAuth.css';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="header">
        <h1 className="logo">みんなの将棋AI</h1>
      </header>
      <main className="main">
        {children}
      </main>
    </>
  );
};

export default Layout;