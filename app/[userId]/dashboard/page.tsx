import App from "../../pages/app";

export default async function DashboardPage({params}: {params: {userId: string}}) {
  let userId = await params.userId;
  return(
    <>
       <App/>
    </>
  )
}
