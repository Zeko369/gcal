import React from "react"
import { useRouter, BlitzPage, useMutation, useParam, useQuery } from "blitz"
import { Heading } from "@chakra-ui/react"
import Layout from "app/layouts/Layout"
import { GroupForm, GroupFormData } from "app/groups/components/GroupForm"
import getGroup from "app/groups/queries/getGroup"
import updateGroup from "app/groups/mutations/updateGroup"

const NewGroupPage: BlitzPage = () => {
  const router = useRouter()
  const id = useParam("id", "number")
  const [group, { mutate }] = useQuery(getGroup, { where: { id } })

  const [updateGroupMutation] = useMutation(updateGroup)

  if (!id) {
    return <Heading>Cant find this group</Heading>
  }

  const onSubmit = async (data: GroupFormData) => {
    try {
      const updated = await updateGroupMutation({ id, data })
      await mutate(updated)
      await router.push("/")
    } catch (error) {
      alert("Error updating group " + JSON.stringify(error, null, 2))
    }
  }

  return (
    <div>
      <Heading>Edit group</Heading>
      <GroupForm onSubmit={onSubmit} initialValues={group} />
    </div>
  )
}

NewGroupPage.getLayout = (page) => <Layout title={"Create group group"}>{page}</Layout>

export default NewGroupPage
