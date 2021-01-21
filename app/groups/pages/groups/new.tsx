import React from "react"
import { useRouter, BlitzPage, useMutation } from "blitz"
import { Heading } from "@chakra-ui/react"
import Layout from "app/layouts/Layout"
import { GroupForm, GroupFormData } from "app/groups/components/GroupForm"
import createGroup from "app/groups/mutations/createGroup"

const NewGroupPage: BlitzPage = () => {
  const router = useRouter()

  const [createGroupMutation] = useMutation(createGroup)

  const onSubmit = async (data: GroupFormData) => {
    try {
      await createGroupMutation({ data })
      router.push("/")
    } catch (error) {
      alert("Error creating group " + JSON.stringify(error, null, 2))
    }
  }

  return (
    <div>
      <Heading>Create new group</Heading>
      <GroupForm onSubmit={onSubmit} />
    </div>
  )
}

NewGroupPage.getLayout = (page) => <Layout title={"Create group group"}>{page}</Layout>

export default NewGroupPage
