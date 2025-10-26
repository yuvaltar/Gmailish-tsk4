const StyledPanel = ({ children }) => {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 0,
        borderRadius: '16px',
        overflow: 'hidden',
        // boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        maxHeight: '88vh',
        marginRight: '1rem',
        marginLeft: '1rem',
        width: 'min(80vw, 1470px)',
        height: 'min(80vh, 1000px)',
      }}
    >
      {children}
    </div>
  );
};

export default StyledPanel;