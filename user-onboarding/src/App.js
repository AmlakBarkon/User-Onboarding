import React, {useState, useEffect} from 'react'
import './App.css'
import * as Yup from 'yup'
import axios from 'axios';

const schema = Yup.object().shape({
    user: Yup.string().required("User is required").min(6,"user need to be 6 chars"),
     star: Yup.string().oneOf(['wars', 'trek'], 'you must select wars or trek'),
     language: Yup.string().oneOf(['1','2','3'], 'you must choose a language'),
     email: Yup.string().required("email"),
     password: Yup.string().required("password inter"),
     agree: Yup.boolean().oneOf([true, false],'You must select agree')
   
})

function App (){
  
   const [form, setForm ] = useState({
       user:"",
       email:'',
       password: '',
       agree: false,
       language:'',
       star:""
      
   })
   const [errors,  setErrors ] = useState({
    user:"",
    email:'',
    password: '',
    agree: '',
    language:'',
    star:""
   
})
const [post, setPost] = useState([]);

const setForErrors = (name, value) => {
  Yup.reach(schema, name).validate(value)
  .then(()=>{
    setErrors({...errors, [name]: ''})
  })
  .catch(err => setErrors({...errors, [name]: err.errors[0]}))
}
 const [ disabled, setDisabled ] = useState(true)
 const change = event=>{
     const {name, value, checked, type } = event.target;
     const valueToUse = type === 'checkbox' ? checked : value;
     setForErrors(name, valueToUse)
     setForm({...form, [name]: valueToUse})
    
 }
 const onsubmit = event =>{
  event.preventDefault();
  axios
    .post("https://reqres.in/api/users", form)
    .then(res => {
      setPost([...post, res.data]); // get just the form data from the REST api
      console.log("success", res);
    })
    .catch(err => console.log(err.response));
 }

 useEffect(() =>{
     axios.get("https://reqres.in/api/users")
     .then(res=>{
         console.log(res.data.data)
        setPost(res.data.data);

     })
   
   .catch(err=> console.log("error"))
  schema.isValid(form).then(valid=>setDisabled(!valid))
  
}, [form])
    return (
        <div className="App">
            <form onSubmit={onsubmit}>

            <pre>{JSON.stringify(post, null, 2)}</pre>

            <label htmlFor="firstName">First Name:
            <input onChange={change} type="text" value={form.user} name="user" placeholder="First Name" />
            </label>< br/>
            <label htmlFor="email">Email:
            <input onChange={change} type="email" value={form.email} name="email" placeholder="Email" />
            </label>< br/>
            <label htmlFor="password">PassWord:
            <input onChange={change} type="password"  value={form.password} name="password" placeholder="Password" />
            </label>< br/>
            <label > Terms of Service
                <input onChange={change} checked={form.agree} name="agree" type="checkbox" />
            </label>< br/>
            <label>Star Trek:
                <input onChange={change}  checked={form.star === "trek"} value="trek"name="star" type="radio" />
            </label>
            <label>Star Wars:
                <input  onChange={change} checked={form.star ==='wars'} value="wars" name="star" type="radio" />
            </label><br/>
            <select onChange={change} value={form.language} name="language">
                <option value="">Select Language</option>
                <option value="1">JavaScript</option>
                <option value="2">Python</option>
                <option value="3">Node</option>
            </select>< br/>
            <button  type="submit" disabled={disabled}>Submit</button>
            </form>
        </div>
    )
}

export default App;