const ResponseMessageSection = ({
  selectedCompletionPair,
  setSelectedCompletionPair,
}) => {
  return (
    <div className="flex-1 bg-black overflow-hidden p-0">
      <textarea
        className="w-full h-full p-6 border-none outline-none resize-none"
        value={
          selectedCompletionPair
            ? selectedCompletionPair.response_json.choices[0].message.content
            : ""
        }
        onChange={(e) => {
          if (selectedCompletionPair) {
            const updatedPair = { ...selectedCompletionPair };
            updatedPair.response_json.choices[0].message.content =
              e.target.value;
            setSelectedCompletionPair(updatedPair);
          }
        }}
        placeholder="Enter response message..."
      />
    </div>
  );
};

export default ResponseMessageSection;
