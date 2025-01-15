const RequestMessageSection = ({
  selectedCompletionPair,
  setSelectedCompletionPair,
  selectedChapter,
}) => {
  return (
    <div className="flex-1 bg-black overflow-hidden p-0">
      <textarea
        className="w-full h-full p-6 border-none outline-none resize-none"
        value={
          selectedCompletionPair
            ? selectedCompletionPair.request_json.messages
                .map((msg) => msg.content)
                .join("\n")
            : ""
        }
        onChange={(e) => {
          if (selectedCompletionPair) {
            const updatedPair = { ...selectedCompletionPair };
            updatedPair.request_json.messages = [
              { role: "user", content: e.target.value },
            ];
            setSelectedCompletionPair(updatedPair);
          } else {
            // Handle the case where selectedCompletionPair is null
            setSelectedCompletionPair({
              request_json: {
                messages: [
                  {
                    role: "system",
                    content: selectedChapter.system_prompt,
                  },
                  { role: "user", content: e.target.value },
                ],
              },
              response_json: { choices: [{ message: { content: "" } }] },
            });
          }
        }}
        placeholder="Enter request message..."
      />
    </div>
  );
};

export default RequestMessageSection;
