export default function errorLogger(functionName: string, error: Error | any) {
  console.log(`Error in ${functionName}, ${error}`);
}
