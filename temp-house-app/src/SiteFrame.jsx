export default function SiteFrame({children}) {
return <><header style={{background:'#570019',color:'white',padding:16,textAlign:'center'}}><a href="/" style={{color:'white',fontWeight:'bold',textDecoration:'none'}}>🏠 HOUSE FOR RENT</a></header>{children}<footer style={{background:'#570019',color:'white',padding:16,textAlign:'center'}}>Making it easier to find a home in Nigeria.<br/>© {new Date().getFullYear()} HOUSE FOR RENT</footer></>
}
