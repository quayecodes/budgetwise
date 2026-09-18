type AlertProps = {
  children: React.ReactNode;
  tone?: "error" | "success";
};

export function Alert({ children, tone = "error" }: AlertProps) {
  return (
    <p
      className={tone === "success" ? "alert alert-success" : "alert alert-error"}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}