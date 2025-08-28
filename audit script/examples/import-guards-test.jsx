// Test file for MUI import guards rule
// This file demonstrates both good and bad import practices

import React from 'react'
import { Box, Button, Typography } from '@mui/material'

// ❌ BAD: Wildcard import - will trigger error
import * from '@mui/icons-material'

// ❌ BAD: Default import with alias - will trigger error
import Icons from '@mui/icons-material'

// ❌ BAD: Another problematic import pattern - will trigger error
import Icon from '@mui/icons-material'

// ❌ BAD: Lodash default import - will trigger error
import _ from 'lodash'

// ✅ GOOD: Named imports - no warnings
import { Add, Edit, Delete, Search, Menu } from '@mui/icons-material'

// ✅ GOOD: Specific lodash imports - no warnings
import pick from 'lodash/pick'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

export default function ImportGuardsTest() {
  return (
    <Box>
      {/* Using the properly imported icons */}
      <Button startIcon={<Add />}>Add Item</Button>
      <Button startIcon={<Edit />}>Edit Item</Button>
      <Button startIcon={<Delete />}>Delete Item</Button>
      
      {/* Using the properly imported lodash functions */}
      <Typography>
        {pick({ name: 'John', age: 30, city: 'NYC' }, ['name', 'age']).name}
      </Typography>
      
      {/* This would cause issues if we used wildcard imports */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Search />
        <Menu />
      </Box>
    </Box>
  )
}

// ❌ BAD: More problematic imports in the same file
// These would also trigger errors:

// import * as MaterialIcons from '@mui/icons-material'
// import { default as Lodash } from 'lodash'
// import AllIcons from '@mui/icons-material'
// import _ from 'lodash-es'  // Alternative lodash package
