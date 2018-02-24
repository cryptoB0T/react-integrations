import React from 'react'
import { upholdApi } from '../apis/uphold'

export const GetUserDetails = () => (<button onClick={upholdApi.getUserDetails}>Get User Details</button>)