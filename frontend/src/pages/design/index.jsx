import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { useState } from "react";

export function Design() {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  const [checked, setChecked] = useState(false);
  const [topicId, setTopicId] = useState("");
  const [topicId2, setTopicId2] = useState("");

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
      <div className="w-52 mt-10">
        <Select
          type="normal"
          value={topicId}
          onChange={setTopicId}
          options={[
            { value: "all", label: "All topics" },
            { value: "another", label: "Another" },
            { value: "test", label: "Test'" },
          ]}
        />
        <div className="mt-20"></div>
        <Select
          type="labeled"
          placeholder="Topic"
          value={topicId2}
          onChange={setTopicId2}
          options={[
            { value: null, label: "No topic" },
            { value: "__create__", label: "Create topic" },
            { value: "another", label: "Another" },
            { value: "test", label: "Test'" },
          ]}
        />
      </div>
    </div>
  </>;
}


