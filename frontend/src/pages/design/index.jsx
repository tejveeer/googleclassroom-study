import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { useState } from "react";

export function Design() {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  const [checked, setChecked] = useState(false);
  return <>
    <div className="min-h-screen w-full p-6">
      <div className="flex w-48 flex-col gap-4">
        <Input 
          placeholder="Standard Input" 
          onChange={(e) => setValue(e.target.value)} 
        />
        <Input
          type="secondary"
          placeholder="Standard Input" 
          onChange={(e) => setValue2(e.target.value)} 
        />
      </div>
      <Checkbox 
        checked={checked} 
        onChange={() => setChecked(prev => !prev)} 
      />
    </div>
  </>;
}


