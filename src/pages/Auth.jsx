import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"


export default function Auth(){
    const [mode,setMode] = useState("login")
    const [error, setError]= useState(null)

    const navigate = useNavigate();


    const {register,
        handleSubmit,
        formState:{errors}
    } = useForm()
    const {signup, user , logout, login} = useContext(AuthContext)


    function onSubmit(data){
        let result;
        if(mode === "signup"){
            result = signup(data.email,data.password)
        }else{
            result = login(data.email, data.password)
        }

        if(result.success){
            navigate("/")
        }else{
            setError(result.error)
        }

        console.log(result)

    }


    return (
        <div className="page">
            <div className="container">
                <div className="auth-container">
                    {user && <p>User logged in {user.email} </p>}
                    <button onClick={()=> logout()}>Log out</button>

                    <h1 className="page-title">
                        {mode == "signup" ? "Sign up" : "Login"}
                    </h1>

                    {error && <div className="error-message"> {error} </div> }

                    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input 
                                className="form-input" 
                                type="email" 
                                id="email" 
                                {...register("email", {required:"Email is required."})}/>
                            {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input 
                                {...register("password", {
                                    required:"Password is required",
                                    minLength: {
                                        value:8,
                                        message:"Password must be at least 8 characters"
                                    },
                                    maxLength: {
                                        value:20,
                                        message:"Password must be at most 20 characters"
                                    }
                                })}
                                className="form-input" 
                                type="password" 
                                id="password"/>
                            {errors.password && <span className="form-error">{errors.password.message}</span>}
                        </div>
                        <button className="btn btn-primary btn-large">
                            {mode == "signup" ? "Sign up" : "Login"}
                        </button>

                    </form>
                    <div className="auth-switch">
                        { mode == "signup" ? 
                            (<p>
                                Already have an account? 
                                <span className="auth-link" onClick={()=>setMode("login")}> Login</span>
                            </p>) :
                            (
                                <p>
                                    Don't have an account? 
                                    <span className="auth-link" onClick={()=>setMode("signup")}> Sign Up</span>
                                </p>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}