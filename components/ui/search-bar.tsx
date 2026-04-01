"use client";

import { useState } from "react";
import Input from "./input";
import Button from "./button";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchBar({ placeholder = "Search...", onSearch, className = "" }: SearchBarProps) {
  const [value, setValue] = useState("");

  return (
    <form action={() => onSearch(value)} className={`flex gap-2 ${className}`}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="w-4 h-4" />}
        className="w-60"
      />
      <Button type="submit" variant="secondary" size="md">
        Search
      </Button>
    </form>
  );
}
