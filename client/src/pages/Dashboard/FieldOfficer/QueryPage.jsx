import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const QueryPage = () => {
  const { notes, allCase } = useSelector((state) => state?.notes || []);

  // useEffect

  return (
    <div>
      <ul className='space-y-2'>
        {notes &&
          notes?.map((note) => (
            <li key={note._id} className='p-3 border rounded shadow'>
              <div className='text-sm text-gray-500'>
                {note.role} - {new Date(note.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>{note.addedBy?.name}</strong>: {note.message}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default QueryPage;
