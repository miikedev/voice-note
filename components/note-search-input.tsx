import React from 'react';
import { Search } from 'lucide-react'; // Assuming you are using lucide-react for the icon
import { Input } from './ui/input';

const NoteSearchInput = () => {
  return (
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        placeholder="Search notes..."
        className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        <Search />
      </div>
    </div>
  );
}

export default NoteSearchInput;
