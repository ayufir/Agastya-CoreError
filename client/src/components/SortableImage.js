const SortableImage = ({ file, index, handleRemove, handlePreview }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: 120,
    height: 120,
    margin: 8,
    position: "relative",
    borderRadius: 4,
    overflow: "hidden",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={file.url || URL.createObjectURL(file.originFileObj)}
        alt={file.name}
        className='w-full h-full object-cover'
        onClick={() => handlePreview(file)}
      />
      <button
        onClick={() => handleRemove(file.uid)}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 20,
          height: 20,
          lineHeight: "20px",
          fontSize: 12,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        X
      </button>
    </div>
  );
};
