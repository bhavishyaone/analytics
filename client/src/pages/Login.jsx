import { Link } from "react-router-dom";

export function Login(){

  return(

    <div>
      <h2>Sign in to Analytiq</h2>
      <p>Don't have an account? <Link to="/register">Create one for free</Link></p>
       <form>

        <div>
          <label htmlFor="email">Email</label><br/>
          <input id="email" type="email" placeholder="Enter your Email." />
        </div>
        
        <div>
          <label htmlFor="password">Password</label><br/>
          <input id="password" type="password" placeholder="Enter your Password." />
        </div>

        <button type="submit">Sign in</button>

        </form>
    </div>
  )
}

