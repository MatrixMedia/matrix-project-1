import { useRouter } from "next/router";
import Link from 'next/link'
const LandingPage = (props) => {
  const router = useRouter();

  return (
    <>     
    <Link href="/">  Home </Link>
  <h2>  Home......................... </h2>
  </>
  )
}
export default LandingPage;