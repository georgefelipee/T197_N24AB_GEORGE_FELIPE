import { StyleSheet } from "react-native";
import { CustomTheme } from "../theme";

export const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
        justifyContent:'center',
        backgroundColor: CustomTheme.colors.background,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 16,
        borderRadius: 8,    
    },
    loginText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: CustomTheme.colors.onSurface,
    },
    link: {
        color: CustomTheme.colors.primary,
        fontWeight: 'bold',
    },
    
});