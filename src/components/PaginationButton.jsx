import { StyleSheet } from "react-native"
import { Button } from "react-native-paper"

const PaginationButton = ({action, children}) => {
    return(
        <Button
            mode="contained"
            onPress={action}
            style={styles.button}
          >
            {children}
          </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 100,
    }
})

export default PaginationButton