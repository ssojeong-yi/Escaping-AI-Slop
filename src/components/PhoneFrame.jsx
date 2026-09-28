export default function PhoneFrame({ children }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <span className="phone-island" />
        {children}
      </div>
    </div>
  );
}
