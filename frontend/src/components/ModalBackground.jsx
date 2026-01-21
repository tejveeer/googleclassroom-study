export function ModalBackground({ setModalOpen, children }) {
  return <>
    <div
      className="fixed z-20 top-0 left-0 flex justify-center items-center min-h-screen w-full bg-black/20"
      onClick={() => setModalOpen?.(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  </>
}