<template>
  <v-card elevation="0" style="width: 100%">
    <v-card-title class="text-center">
      <v-icon icon="mdi-plus" style="color: #fbc02d" class="mb-2"></v-icon>
      <span class="text-h5" style="color: #fbc02d">Add Employee</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Name*" required hint="Required"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field required label="Code*" hint="Required"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Phone number*"
              hint="Required"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              required
              label="National ID*"
              hint="Required"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-file-input clearable label="Employee image"></v-file-input>
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Role*"
              chips
              persistent-hint
              hint="Required"
              :items="['Supervisor', 'Employee']"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12"
            ><v-textarea
              clearable
              label="Note"
              prepend-icon="mdi-note-text-outline"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text"> Close </v-btn>
      <v-btn color="blue-darken-1" variant="text"> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>
