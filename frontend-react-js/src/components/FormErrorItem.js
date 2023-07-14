export default function FormErrorItem(props) {
    const render_error = () => {
        switch (props.err_code) {
            case 'generic_500':
                return "An internal server error occured"
                break;
            case 'generic_403':
                return "You are not authorized to perform this action"
                break;
            case 'generic_401':
                return "You are not authenticated to perform this action"
                break;
            //Replies
            case 'cognito_user_id_blank':
                return "User was not found"
                break;
            case 'activity_uuid_blank':
                return "Original post was not found"
                break;
            case 'message_blank':
                return "Message cannot be blank"
                break;
            case 'message_exceed_max_chars_1024':
                return "Message exceeds max characters allowed"
                break;
            //Users
            case 'message_group_uuid_blank':
                return "Message group not found"
                break;   
            case 'user_receiver_handle_blank':
                return "User not found"
                break; 
            //Profile
            case 'display_name_blank':
                return "Display name cannot be blank"
                break;
            default:
                return props.err_code
                break  ;    
        }
    }
    return (
        <div className="errorItem">
          {render_error()}
        </div>
    )
}