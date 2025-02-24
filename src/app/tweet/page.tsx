import { getTweet } from "react-tweet/api";

export default async function TweetPage() {
  const tweet = await getTweet("1891681764474544210");
  console.log(tweet);
  return <div>Tweet</div>;
}
