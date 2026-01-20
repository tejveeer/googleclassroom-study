import { Input } from "@/components/Input";
import { useState } from "react";

export function Design() {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  console.log(value);
  return <>
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
  </>;
}


