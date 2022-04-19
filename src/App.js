import './App.css';
import { useState,  useEffect } from 'react';
import Post from './components/post/post.component';
import { Button, Modal, makeStyles, Input } from '@material-ui/core';
import ImageUpload from './components/imageUpload/ImageUpload.component';

const BASE_URL = 'http://localhost:8000/'

const getModalStyle = () => {
  const top = 50;
  const left = 50;



  return (
    {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%`,
    }
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}))

function App() {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authToken, setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null)
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    setAuthToken(window.localStorage.getItem('authToken'));
    setAuthTokenType(window.localStorage.getItem('authTokenType'));
    setUsername(window.localStorage.getItem('username'));
    setUserId(window.localStorage.getItem('userId'))
  }, [])

  useEffect(() => {
    authToken ?
      window.localStorage.setItem('authToken', authToken)
      : window.localStorage.removeItem('authToken')
    authTokenType ?
      window.localStorage.setItem('authTokenType', authTokenType)
      : window.localStorage.removeItem('authTokenType')
    username ?
      window.localStorage.setItem('username', username)
      : window.localStorage.removeItem('username')
    userId ?
      window.localStorage.setItem('userId', userId)
      : window.localStorage.removeItem('userId')

  }, [authToken, authTokenType, userId])

  useEffect(() =>{
    fetch(BASE_URL + 'post/all')
      .then(response => {
        const json = response.json()
        console.log(json);
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        const result = data.sort((a, b) => {
          const time_a = a.timestamp.split(/[-T:]/);
          const time_b = b.timestamp.split(/[-T:]/);
          const date_a = new Date(Date.UTC(time_a[0], time_a[1]-1, time_a[2], time_a[3], time_a[4], time_a[5]));
          const date_b = new Date(Date.UTC(time_b[0], time_b[1]-1, time_b[2], time_b[3], time_b[4], time_b[5]));
          return date_b - date_a
        })
        return result
      })
      .then(data => {
        setPosts(data)
        console.log(data)
      })
      .catch(error => {
        console.log(error);
        alert(error)
      })
  }, [])

  const signIn = (event) => {
    event?.preventDefault()

    let formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)

    const requestOptions = {
      method: 'POST',
      body: formData,
    }

    fetch(BASE_URL + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        console.log(data);
        setAuthToken(data.access_token)
        setAuthTokenType(data.token_type)
        setUserId(data.user_id)
        setUsername(data.username)
      })
      .catch(error => {
        console.log(error)
        alert(error)
      })
  setOpenSignIn(false)
  }

  const signOut = (event) => {
    setAuthToken(null)
    setAuthTokenType(null)
    setUserId("")      
    setUsername("")

  }

  const signUp = (event) => {
    event?.preventDefault();

    const json_string = JSON.stringify({
      username: username,
      email: email,
      password: password
    })

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_string
    }

    fetch(BASE_URL + 'user/', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        console.log(data)
        signIn()
      })
      .catch(error =>{
        console.log(error);
        alert(error);
      })


    setOpenSignUp(false)
  }

  return (
    <div className='app'>
      <Modal 
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signin">
              <center>
                <img className='app_header_image' src="https://haileeann.files.wordpress.com/2021/08/ig-logo.png" alt='Instagram' />
              </center>
              <Input 
                placeholder='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)} />

              <Input 
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)} />

              <Button type='submit' onClick={signIn}>
                Login
              </Button>
            </form>
          </div>
        </Modal>

        <Modal 
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signin">
              <center>
                <img className='app_header_image' src="https://haileeann.files.wordpress.com/2021/08/ig-logo.png" alt='Instagram' />
              </center>
              <Input 
                placeholder='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              <Input 
                placeholder='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)} />

              <Input 
                placeholder='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)} />

              <Button type='submit' onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </Modal>

      <div className="app_header">
        <img className='app_header_image' src="https://haileeann.files.wordpress.com/2021/08/ig-logo.png" alt="Instagram" />
      
      {authToken ? (
        <Button onClick={signOut}>LOGOUT</Button>
      ): (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>LOGIN</Button>
            <Button onClick={() => setOpenSignUp(true)}>SIGN UP</Button>
          </div>
        )
      }
      </div>
      <div className='app_posts'>
        {
          posts.map(post => (
            <Post 
              post = {post}
              authToken={authToken}
              authTokenType={authTokenType}
              username={username}
            />
          ))
        }
      </div>
      {
        authToken ? (
          <ImageUpload 
            authToken={authToken}
            authTokenType={authTokenType}
            userId={userId}
          />
        ) : (
          <h3>You need to login to upload</h3>
        )
      }
    </div>
  );
}

export default App;
