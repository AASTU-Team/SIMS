import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    borderColor: "#000",
  },
  cgpa: {
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
  },
  degreeSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  degreeText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  studentInfoSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  studentInfoText: {
    fontSize: 8,
  },
  text: {
    fontSize: 8,
  },
  lineSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
    marginTop: 10,
    marginBottom: 10,
  },
  imageAuthenticationSection: {
    position: "relative",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  qrCode: {
    width: 100,
    height: 100,
  },
});

// Create Document Component
const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={"/images/logo.jpg"} style={{ width: 50, height: 50 }} />
        <Text style={styles.headerText}>
          Addis Ababa Science and Technology University
        </Text>
        <Text style={styles.headerText}>Transcript</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.studentInfoSection}>
          <Text style={styles.studentInfoText}>Student ID: {data.id}</Text>
          <Text style={styles.studentInfoText}>{data.name}</Text>
        </View>
        <View style={styles.degreeSection}>
          <Text style={styles.degreeText}>Date:</Text>
          <Text style={styles.degreeText}>{data.date}</Text>
        </View>
        <View style={styles.degreeSection}>
          <Text style={styles.degreeText}>CGPA:</Text>
          <Text style={styles.degreeText}>{data.cgpa}</Text>
        </View>
        <View style={styles.lineSeparator} />
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Course Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Course Code</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Attempted</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Earned</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Grade</Text>
            </View>
          </View>
          {/* {data.map(() => ( */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.text}>Internet Programming</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>SWEg1010</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>1</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>90</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.text}>A</Text>
            </View>
          </View>
          {/* ))} */}
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
