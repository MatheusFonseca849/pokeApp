import { StyleSheet } from "react-native"
import { Button, IconButton } from "react-native-paper"

const PaginationButton = ({action, icon, children}) => {
    return(
        <IconButton
            mode="contained"
            onPress={action}
            style={styles.button}
            icon={icon}
          >
            {children}
          </IconButton>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 100,
        alignSelf: "flex-start",
    }
})

export default PaginationButton