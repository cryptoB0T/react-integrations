import React from 'react'
import { upholdApi } from '../apis/uphold'

export const UserDetails = () => (<button onClick={upholdApi.getUserDetails}>Get User Details</button>)